up-local:
	NETWORK_RPC=localhost:http://host.docker.internal:8545 docker-compose -p localhost up
up-rinkeby:
	NETWORK_RPC=rinkeby:https://rinkeby.infura.io/v3/8b583b2349ab4905adf8bf60095ee6cb docker-compose -p rinkeby up
up-goerli:
	NETWORK_RPC=goerli:https://eth-goerli.g.alchemy.com/v2/IG5Is2xWE1WkB-h0cN1NX58xw_74WEZj docker-compose -p goerli up
clean:
	rm -rf ./data