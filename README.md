## (cf-cli-ga) Cloud Foundry CLI Github Actions

The main idea of the project is to wrap CF CLI into nodejs github actions.

### TODO:

* Decouple CF CLI installation
* Decouple Login
* Decouple Logout
* Unify auth configs
  * multiple fields
  * json config
  * prefix for values
* Move from yauzl to @actions/tool-cache (https://www.npmjs.com/package/@actions/tool-cache)
* Adjust linters!

### Source structure


| folder                        | description                                                     |
| ------------------------------- | ----------------------------------------------------------------- |
| src                           | Source code                                                     |
| src/actions                   | Custom Github actions                                           |
| src/actions/definitions       | Definitions of custom github actions (for action.yml)           |
| src/actions/definitions/block | Reusable blocks for github actions definitions (for action.yml) |
| src/cf                        | Realization of custom github actions in TS                      |
| src/github                    | Class structure to build custom action yaml definitions in JS   |
| util                          | Supportive utils generaly for building/packaging                |
| lib                           | (Generated) Folder for compiled js from ts artifacts            |
| dist                          | (Generated) Packaged custom actions                             |

### NCC BUILD

For packaging @vercel/ncc is used with custom builder from code: util/ncc-build.js

It search for all files with a mask '../lib/cf/*/main.js' and packages it into ../dist/{folder name that containing main.js}/. Packages with a map and sourcemap-register.

### Building of actions.yml(yaml) file

action.yaml file:

* is build up with custom builder (src/actions/builder.ts) which translates JS objects describing action.yaml into actual yaml.
* contains all definitions of custom actions in single file.

Custom builder reasons to use:

* Reuse of yaml code blocks
* Posibility to use constants
* Posibility to maintain actions yaml config in separate file
* Combine all of the yaml configs into single file

**src/github** folder contains classes that describes action.yaml structure and contains interfaces and validators to enable code-complete and checks on building yaml (accroding to https://json.schemastore.org/github-action.json schema).
