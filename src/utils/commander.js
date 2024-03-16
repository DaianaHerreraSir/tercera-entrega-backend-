import { Command } from "commander"


export const program = new Command()

program
    
    .option("--mode <mode>", "especificaciones de entorno", "development")
    .parse()
    
