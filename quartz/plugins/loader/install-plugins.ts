#!/usr/bin/env node
import { installPlugins, parsePluginSource } from "./gitLoader.js"
import fs from "fs"
import path from "path"
import YAML from "yaml"

async function main() {
  let externalPlugins: string[] = []
  try {
    const configPath = path.join(process.cwd(), "quartz.config.yaml")
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, "utf-8")
      const yaml = YAML.parse(raw) as any
      externalPlugins = yaml.externalPlugins || []
    }
  } catch (e) {
    // ignore
  }

  if (externalPlugins.length === 0) {
    console.log("No external plugins to install.")
    return
  }

  console.log(`Installing ${externalPlugins.length} plugin(s) from Git...`)

  const specs = externalPlugins.map((source: string) => parsePluginSource(source))
  const installed = await installPlugins(specs, { verbose: true })

  if (installed.size === externalPlugins.length) {
    console.log("✓ All plugins installed successfully")
  } else {
    console.error(`✗ Only ${installed.size}/${externalPlugins.length} plugins installed`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Failed to install plugins:", err)
  process.exit(1)
})
