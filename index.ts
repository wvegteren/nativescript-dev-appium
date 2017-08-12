import * as fs from "fs";
import * as path from "path";
import * as yargs from 'yargs';
import * as child_process from "child_process";
import * as utils from "./utils";
import { resolveCapabilities } from "./capabilities-helper";
import { ServerOptions } from './server-options';
import { AppiumDriver } from './appium-driver';
import { ElementHelper } from './element-helper';
import { createAppiumDriver } from './appium-driver';
import { startAppiumServer, stopAppiumServer } from './appium-server';
export * from "./appium-driver";

// TODO: Remove server options class and use instead AppiumServer
const serverOptoins = new ServerOptions(9230);
export function startServer(port) {
    return startAppiumServer(serverOptoins.port);
};

export function stopServer() {
    return stopAppiumServer(serverOptoins.port);
};

const caps: any = resolveCapabilities(utils.capabilities, utils.runType);
export function createDriver() {
    if (!caps) {
        throw new Error("Provided path to appium capabilities is not correct!");
    }
    if (!utils.runType) {
        throw new Error("--runType is missing! Make sure it is provided correctly! It is used to parse the configuration for appium driver!");
    }
    return createAppiumDriver(utils.runType, serverOptoins.port, caps, utils.isSauceLab);
};

export function elementHelper() {
    return new ElementHelper(this.caps.platformName.toLowerCase(), this.caps.platformVersion.toLowerCase());
}

process.on("exit", (server) => utils.shutdown(server));
process.on('uncaughtException', (server) => utils.shutdown(server)); 
