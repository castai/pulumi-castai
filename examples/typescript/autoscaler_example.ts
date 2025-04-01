import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai"; 

// Placeholder: Assume clusterId is obtained from another resource
const clusterId = "your-cluster-id";

const autoscalerSettings = new castai.Autoscaler("example-ts-autoscaler", {
    clusterId: clusterId,
    enabled: true,
    isScopedMode: false, 

    unschedulablePods: [{
        enabled: true,
    }],

    nodeDownscaler: [{
        enabled: true,
        emptyNodes: [{
            delaySeconds: 180,
        }],
    }],
});

// Export the ID (often the cluster ID itself for singleton resources like this)
export const autoscalerResourceId = autoscalerSettings.id; // Or potentially clusterId if it modifies in place 