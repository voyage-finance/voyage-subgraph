# Voyage Subgraph

This subgraph indexes the Voyage protocol diamond.

## Development

First, start all necessary containers:

```shell
docker-compose up
```

Then create the subgraph in the local node:

```shell
cd subgraph-v1
yarn create-local
```

Then deploy the subgraph:

```shell
yarn deploy-local
```

NOTE: this will index **Fuji**

## Workflow

Once you're set up with the above steps, you probably want to start testing your subgraph. You can do this very easily.

```shell
# OPTIONAL: only if you edited the schema.graphql file.
# This command re-generates the TS files used to write mappings and save entities.
yarn codegen

# redeploy the subgraph
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
