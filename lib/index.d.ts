import { Command } from '@oclif/command';
/**
 * The main class to launch the cli
 */
declare class IblisCliSetupGoogleClient extends Command {
    static description: string;
    run(): Promise<void>;
}
export = IblisCliSetupGoogleClient;
