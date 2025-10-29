/**
 * Utility functions for Pulumi testing in TypeScript
 */

import * as pulumi from "@pulumi/pulumi";

/**
 * Helper to convert Pulumi Output to Promise for testing
 * Since Output.promise() may not be available in all versions
 */
export function promisify<T>(output: pulumi.Output<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        output.apply(value => {
            resolve(value);
            return value;
        });
    });
}

/**
 * Helper to wait for multiple Pulumi Outputs
 */
export function promisifyAll<T extends any[]>(...outputs: { [K in keyof T]: pulumi.Output<T[K]> }): Promise<T> {
    return new Promise((resolve, reject) => {
        pulumi.all(outputs).apply(values => {
            resolve(values as T);
            return values;
        });
    });
}
