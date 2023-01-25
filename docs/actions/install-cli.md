## INSTALL CLI

Looking for installed CLI on worker. If worker not found tries to install it. Install plugins if required and missing.

Supported plugins: multiapps, html5-plugin.


#### Inputs

| Name                      | Required | Description                                                | Default                                                                                   |
| --------------------------- | ---------- | :----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| cfInstallationPathLinux   | false    | Path to CF CLI installation archive for Linux workers      | https://packages.cloudfoundry.org/stable?release=linux64-binary&version=v8&source=github  |
| cfInstallationPathWindows | false    | Path to CF CLI installation archive for Windows workers    | https://packages.cloudfoundry.org/stable?release=windows64-exe&version=v8&source=github   |
| cfInstallationPathMac     | false    | Path to CF CLI installation archive for Mac workers        | https://packages.cloudfoundry.org/stable?release=macosx64-binary&version=v8&source=github |
| plugins                   | false    | List of comma separated plugins reuquired for installation | multiapps, html5-plugin                                                                   |


#### Usage example

```yaml
name: test-cli-install
on: 
  workflow_dispatch
jobs:
  test-cli-install:
    runs-on: [self-hosted]
    steps:   
      - name: Install CF CLI
        id: cf-install-cli
        uses: ./cf/install-cli
        with:
          plugins: multiapps, html5-plugin
```
