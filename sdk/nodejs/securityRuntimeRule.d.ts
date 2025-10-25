import * as pulumi from "@pulumi/pulumi";
export declare class SecurityRuntimeRule extends pulumi.CustomResource {
    /**
     * Get an existing SecurityRuntimeRule resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecurityRuntimeRuleState, opts?: pulumi.CustomResourceOptions): SecurityRuntimeRule;
    /**
     * Returns true if the given object is an instance of SecurityRuntimeRule.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecurityRuntimeRule;
    /**
     * Number of anomalies detected using this rule.
     */
    readonly anomaliesCount: pulumi.Output<number>;
    /**
     * Category of the rule.
     */
    readonly category: pulumi.Output<string | undefined>;
    /**
     * Whether the rule is enabled.
     */
    readonly enabled: pulumi.Output<boolean | undefined>;
    /**
     * Indicates whether the rule is a built-in rule.
     */
    readonly isBuiltIn: pulumi.Output<boolean>;
    /**
     * Key-value labels attached to the rule.
     */
    readonly labels: pulumi.Output<{
        [key: string]: string;
    } | undefined>;
    readonly name: pulumi.Output<string>;
    /**
     * Optional CEL expression for resource selection.
     */
    readonly resourceSelector: pulumi.Output<string | undefined>;
    /**
     * The engine type used to evaluate the rule. Only RULE_ENGINE_TYPE_CEL is currently supported.
     */
    readonly ruleEngineType: pulumi.Output<string | undefined>;
    /**
     * CEL rule expression text.
     */
    readonly ruleText: pulumi.Output<string>;
    /**
     * Severity of the rule. One of SEVERITY_CRITICAL, SEVERITY_HIGH, SEVERITY_MEDIUM, SEVERITY_LOW, SEVERITY_NONE.
     */
    readonly severity: pulumi.Output<string>;
    /**
     * Type of the rule (internal value).
     */
    readonly type: pulumi.Output<string>;
    /**
     * Custom lists used in this rule, if any.
     */
    readonly usedCustomLists: pulumi.Output<string[]>;
    /**
     * Create a SecurityRuntimeRule resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SecurityRuntimeRuleArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecurityRuntimeRule resources.
 */
export interface SecurityRuntimeRuleState {
    /**
     * Number of anomalies detected using this rule.
     */
    anomaliesCount?: pulumi.Input<number>;
    /**
     * Category of the rule.
     */
    category?: pulumi.Input<string>;
    /**
     * Whether the rule is enabled.
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * Indicates whether the rule is a built-in rule.
     */
    isBuiltIn?: pulumi.Input<boolean>;
    /**
     * Key-value labels attached to the rule.
     */
    labels?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
    name?: pulumi.Input<string>;
    /**
     * Optional CEL expression for resource selection.
     */
    resourceSelector?: pulumi.Input<string>;
    /**
     * The engine type used to evaluate the rule. Only RULE_ENGINE_TYPE_CEL is currently supported.
     */
    ruleEngineType?: pulumi.Input<string>;
    /**
     * CEL rule expression text.
     */
    ruleText?: pulumi.Input<string>;
    /**
     * Severity of the rule. One of SEVERITY_CRITICAL, SEVERITY_HIGH, SEVERITY_MEDIUM, SEVERITY_LOW, SEVERITY_NONE.
     */
    severity?: pulumi.Input<string>;
    /**
     * Type of the rule (internal value).
     */
    type?: pulumi.Input<string>;
    /**
     * Custom lists used in this rule, if any.
     */
    usedCustomLists?: pulumi.Input<pulumi.Input<string>[]>;
}
/**
 * The set of arguments for constructing a SecurityRuntimeRule resource.
 */
export interface SecurityRuntimeRuleArgs {
    /**
     * Category of the rule.
     */
    category?: pulumi.Input<string>;
    /**
     * Whether the rule is enabled.
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * Key-value labels attached to the rule.
     */
    labels?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
    name?: pulumi.Input<string>;
    /**
     * Optional CEL expression for resource selection.
     */
    resourceSelector?: pulumi.Input<string>;
    /**
     * The engine type used to evaluate the rule. Only RULE_ENGINE_TYPE_CEL is currently supported.
     */
    ruleEngineType?: pulumi.Input<string>;
    /**
     * CEL rule expression text.
     */
    ruleText: pulumi.Input<string>;
    /**
     * Severity of the rule. One of SEVERITY_CRITICAL, SEVERITY_HIGH, SEVERITY_MEDIUM, SEVERITY_LOW, SEVERITY_NONE.
     */
    severity: pulumi.Input<string>;
}
