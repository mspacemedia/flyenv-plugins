# mspacemedia FlyEnv plugins

One community registry for API Client, Mocktoon and Stripe CLI. Each plugin keeps its own source repository and versioned release packages.

## Add to FlyEnv

Open **Settings → Plugin Market**, add this registry URL and refresh:

```text
https://raw.githubusercontent.com/mspacemedia/flyenv-plugins/main/registry.json
```

Choose the plugins you want to install. Existing FlyEnv plugin approval and license requirements apply.

| Plugin | Purpose | Source |
| --- | --- | --- |
| API Client | Compose API requests, inspect responses and discover documented endpoints from OpenAPI/Swagger. | [flyenv-api-client](https://github.com/mspacemedia/flyenv-api-client) |
| Mocktoon | Run editable local mock APIs with MockShip, MockPurchase, MockSend, MockStock and MockAuth examples. | [flyenv-mocktoon](https://github.com/mspacemedia/flyenv-mocktoon) |
| Stripe CLI | Stripe login, local test webhook forwarding, sample events and test-data tools. | [flyenv-stripe-cli](https://github.com/mspacemedia/flyenv-stripe-cli) |

Updated FlyEnv builds can group these plugins under **API Tools**. On older hosts they remain in their existing sections: API Client and Mocktoon under Other, Stripe CLI under Network Tunnel. This registry does not update the FlyEnv application itself.

These are community preview releases. Automated checks and local fixture tests are recorded in the individual repositories; manual installed-app acceptance and native platform coverage should be assessed separately. Mocktoon examples are editable fixtures, and API Client uses the API your app already provides.

## Maintaining the catalog

Build and test each plugin in its own repository. Publish a new version and its matching `registry.json` release asset; keep published release packages immutable. Copy its catalog entry into this repository's `registry.json`, preserving the package URL and SHA-256 from that build. Use the same plugin id across versions so FlyEnv recognises updates.

Run `node scripts/verify.mjs` before committing an update. It validates the three-entry catalog and downloads each release package to verify its checksum. It does not install plugins or execute their code.

Plugin implementations retain the licenses in their own repositories. This catalog and its original documentation are MIT licensed.
