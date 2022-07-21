# Voyage Subgraph

This subgraph indexes the Voyage protocol diamond.

## Development

First, start **one** of the network script(up containers). You can check all scripts in `Makefile`:

```shell
make up-local # for local hardhat run
make up-rinkeby # for rinkeby run
make up-goerli # for goerli run
```

Then create the subgraph in the local node:

```shell
cd subgraph-v1
yarn create-local
```

In order to change contractAddress and blockNumber:
1) you have to change `address` and `blockNumber` in `networks.json` under working network
2) run `yarn build-{network}` where `network` can be: `local, rinkeby, goerli`

> After `yarn build-{network}`, the subgraph.yaml will be rewritten with needed `address`, `blockNumber` and `network`

Then deploy the subgraph:

```shell
yarn deploy-{network} # where network options: local, rinkeby, goerli
```

NOTE: this will index network, e.g. **Fuji**

## Workflow

Once you're set up with the above steps, you probably want to start testing your subgraph. You can do this very easily.

```shell
# OPTIONAL: only if you edited the schema.graphql file.
# This command re-generates the TS files used to write mappings and save entities.
yarn codegen

# rebuild the subgraph(if necessary) to have correct subgraph.yaml
yarn build-local

# deploy
yarn deploy-local

```

If the above simple workflow fails, simply nuke the subgraph and start again.

```shell

# delete the subgraph
yarn remove-local

# recreate the subgraph
yarn create-local

# redeploy
yarn deploy-local
```
