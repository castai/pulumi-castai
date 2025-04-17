PROJECT_NAME := castai
PACK           := castai
ORG            := castai
PROJECT        := github.com/${ORG}/pulumi-${PACK}
NODE_MODULE_NAME := @castai/pulumi-${PACK}
TF_NAME        := ${PACK}
PROVIDER_PATH  := provider
VERSION_PATH   := ${PROVIDER_PATH}/pkg/version
# CENTRAL VERSION SOURCE - Read from version.txt
VERSION        := $(shell cat version.txt | tr -d '\n')
TFGEN          := pulumi-tfgen-${PACK}
PROVIDER       := pulumi-resource-${PACK}
CODEGEN        := pulumi-gen-${PACK}
VERSION_FILE   := ${VERSION_PATH}/version.go

SCHEMA         := schema.json
PROVIDER_SCHEMA := ${PROVIDER_PATH}/cmd/${PROVIDER}/${SCHEMA}
DOCS_PATH      := ${PROVIDER_PATH}/docs
GENERATE       := pulumi-gen-${PACK}

TESTPARALLELISM := 10

WORKING_DIR    := $(shell pwd)

OS := $(shell uname)
EMPTY_TO_AVOID_SED := ""

# Use go from PATH
GO_EXECUTABLE := go

.PHONY: development provider build_sdks build_nodejs build_dotnet build_go build_python install_provider cleanup build_schema build_examples ensure publish_packages publish publish_nodejs publish_python publish_go build_codegen check_schema create_docs test clean help

development:: install_dependencies provider build_sdks install_provider cleanup # Build the provider & SDKs for a development environment

# Required for the codegen action that runs in pulumi/pulumi
build:: install_dependencies provider build_schema build_sdks install_provider # Build the provider & SDKs for a development environment

tfgen:: install_dependencies
	(cd ${PROVIDER_PATH} && ${GO_EXECUTABLE} build -o $(WORKING_DIR)/bin/${TFGEN} -ldflags "-X ${PROJECT}/${VERSION_PATH}.Version=${VERSION}" ${PROJECT}/${PROVIDER_PATH}/cmd/${TFGEN})
	$(WORKING_DIR)/bin/${TFGEN} schema --out ${PROVIDER_PATH}/cmd/${PROVIDER}
	(cd ${PROVIDER_PATH} && ${GO_EXECUTABLE} generate cmd/${PROVIDER}/main.go)

provider:: tfgen install_dependencies # build the provider binary
	# Update version.go with the version from version.txt
	sed -i.bak "s/__VERSION__/${VERSION}/g" ${VERSION_FILE} && rm -f ${VERSION_FILE}.bak
	(cd ${PROVIDER_PATH} && ${GO_EXECUTABLE} build -o $(WORKING_DIR)/bin/${PROVIDER} -ldflags "-X ${PROJECT}/${VERSION_PATH}.Version=${VERSION}" ${PROJECT}/${PROVIDER_PATH}/cmd/${PROVIDER})

build_schema:: tfgen # build the schema
	(cd ${PROVIDER_PATH} && ${GO_EXECUTABLE} build -o $(WORKING_DIR)/bin/${TFGEN} -ldflags "-X ${PROJECT}/${VERSION_PATH}.Version=${VERSION}" ${PROJECT}/${PROVIDER_PATH}/cmd/${TFGEN})
	@echo "Checking for version string '${VERSION}' in compiled tfgen binary:"
	@strings $(WORKING_DIR)/bin/${TFGEN} | grep -q "${VERSION}" && echo "✅ Version string found in tfgen binary." || (echo "❌ Version string NOT found in tfgen binary! Ldflags might not be working." && exit 1)
	# Ensure schema path is clean and generate schema from within the provider dir
	rm -rf $(WORKING_DIR)/${SCHEMA}
	(cd ${PROVIDER_PATH} && $(WORKING_DIR)/bin/${TFGEN} schema > $(WORKING_DIR)/${SCHEMA})
	@echo "Injecting version into schema file..."
	# Inject the version line after the 'publisher' line using sed
	@echo "Injecting version into schema file..."
	# Use the fix_schema.sh script to add/update the version field
	@./scripts/fix_schema.sh "${VERSION}" "$(WORKING_DIR)/provider/cmd/pulumi-resource-castai/schema.json"
	@cp "$(WORKING_DIR)/provider/cmd/pulumi-resource-castai/schema.json" "$(WORKING_DIR)/${SCHEMA}"
	@echo "Verifying version in schema file:"
	@grep '"version":' $(WORKING_DIR)/${SCHEMA} || echo "Warning: Version not found in schema file, but continuing anyway."

build_examples: ensure # build the examples
	@echo "Building Node.js SDK examples"
	cd examples && yarn && yarn compile

build_test:: # build just the test directory
	cd tests && go test -v -c -o $(WORKING_DIR)/bin/tests .

build_sdks:: install_dependencies provider build_nodejs build_python build_go build_dotnet # build all the SDKs

build_nodejs:: install_dependencies # build the node sdk
	rm -rf sdk/nodejs
	$(WORKING_DIR)/bin/${TFGEN} nodejs --out sdk/nodejs/ --overlays provider/overlays/nodejs
	cd sdk/nodejs && \
		grep -l "\$${VERSION}" package.json && \
		sed -i.bak 's/"\$${VERSION}"/"$(VERSION)"/g' package.json && rm -f package.json.bak && \
		yarn install && \
		yarn run tsc && \
		cp ../../README.md ../../LICENSE package.json ./bin/ && \
		cp package.json ./bin/

build_python:: install_dependencies # build the python sdk
	rm -rf sdk/python
	$(WORKING_DIR)/bin/${TFGEN} python --out sdk/python/ --overlays provider/overlays/python
	cd sdk/python && \
		cp ../../README.md . && \
		python -m pip install build && python -m build .

build_go:: install_dependencies # build the go sdk
	rm -rf sdk/go
	$(WORKING_DIR)/bin/${TFGEN} go --out sdk/go/ --overlays provider/overlays/go

build_dotnet:: install_dependencies # build the dotnet sdk
	@echo "Building .NET SDK with version ${VERSION}"
	rm -rf sdk/dotnet
	$(WORKING_DIR)/bin/${TFGEN} dotnet --out sdk/dotnet/ --overlays provider/overlays/dotnet
	@echo "Fixing .NET SDK naming conflicts"
	./scripts/fix_dotnet_naming.sh
	@echo "Creating version.txt file"
	echo "${VERSION}" > sdk/dotnet/version.txt
	@echo "Building .NET SDK"
	cd sdk/dotnet && \
		dotnet build /p:Version=${VERSION} -c Release -v detailed

install_dependencies:: # install dependencies for the provider and code generator
	@echo "Ensure pulumi is installed"
	@pulumi version || curl -fsSL https://get.pulumi.com | sh

build_codegen:: # build the codegen binary
	(cd ${PROVIDER_PATH} && ${GO_EXECUTABLE} build -o $(WORKING_DIR)/bin/${CODEGEN} -ldflags "-X ${PROJECT}/${VERSION_PATH}.Version=${VERSION}" ${PROJECT}/${PROVIDER_PATH}/cmd/${CODEGEN})

install_provider:: # build the schema
	mkdir -p ~/.pulumi/plugins/resource-${PACK}-${VERSION}
	cp $(WORKING_DIR)/bin/${PROVIDER} ~/.pulumi/plugins/resource-${PACK}-${VERSION}/
	echo "resource: true" > ~/.pulumi/plugins/resource-${PACK}-${VERSION}/PulumiPlugin.yaml
	echo "name: ${PACK}" >> ~/.pulumi/plugins/resource-${PACK}-${VERSION}/PulumiPlugin.yaml
	echo "version: ${VERSION}" >> ~/.pulumi/plugins/resource-${PACK}-${VERSION}/PulumiPlugin.yaml
	echo "server: ${PROVIDER}" >> ~/.pulumi/plugins/resource-${PACK}-${VERSION}/PulumiPlugin.yaml
	@echo "Provider installed successfully. PulumiPlugin.yaml has been created."

test::
	cd tests && go test -v -count=1 -cover -timeout 2h -parallel ${TESTPARALLELISM} ./...

cleanup:: # cleans up the temporary directory
	rm -r $(WORKING_DIR)/bin
	rm -r $(WORKING_DIR)/schema.json

help::
	@grep '^[^.#]\+:\s\+.*#' Makefile | cut -d ':' -f 1 | sort

clean::
	rm -rf bin schema.json sdk provider/cmd/${PROVIDER}/${SCHEMA}

ensure::
	cd $(WORKING_DIR)/examples && yarn install

create_docs:: build_codegen
	rm -rf ${WORKING_DIR}/docs
	mkdir -p ${DOCS_PATH}
	$(WORKING_DIR)/bin/${CODEGEN} docs ${PROVIDER_SCHEMA} ${DOCS_PATH}
	cp -r ${DOCS_PATH}/. ${WORKING_DIR}/docs

check_schema:: build_schema # check if the schema has changed from what is committed
	@git diff --exit-code $(SCHEMA) || (echo "Error: The schema has changed. Please run 'make build_schema' and commit the changes." && exit 1)

# Publishing Targets
publish:: provider build_sdks install_provider create_docs publish_packages # build and publish all SDK's

publish_packages:: publish_nodejs publish_python publish_go publish_dotnet # publish all SDK packages

publish_nodejs:: # publish to NPM
	cd sdk/nodejs/bin && \
		npm publish --access public

publish_python:: # publish to PyPI
	cd sdk/python && \
		twine check dist/* && \
		twine upload \
			--skip-existing \
			--verbose \
			dist/*

publish_go:: # publish to GitHub
	@echo "Publishing Go SDK version v$(VERSION)..."
	@./scripts/publish_go_package.sh "$(VERSION)"
	@echo "Go SDK has been published to GitHub."
	@echo "The package should be available at: https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$(VERSION)"
	@echo "Note: It may take a few minutes for pkg.go.dev to index the new version."

publish_dotnet:: # publish to NuGet
	@echo "Publishing .NET package with version ${VERSION}"
	cd sdk/dotnet && \
		dotnet pack -o nupkg -p:Version=${VERSION} -c Release --no-build && \
		dotnet nuget push nupkg/*.nupkg --api-key "${NUGET_AUTH_TOKEN}" --source https://api.nuget.org/v3/index.json || \
		echo "Warning: Failed to publish to NuGet. See error message above."
