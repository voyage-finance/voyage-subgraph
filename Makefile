up-local:
	NETWORK_RPC=localhost:http://host.docker.internal:8545 docker-compose -p localhost up
up-goerli:
	NETWORK_RPC=goerli:https://eth-goerli.g.alchemy.com/v2/IG5Is2xWE1WkB-h0cN1NX58xw_74WEZj docker-compose -p goerli up
up-mainnet:
	NETWORK_RPC=mainnet:https://eth-mainnet.g.alchemy.com/v2/_ugyedYRT9AOVAGTuXNVKSgFuauulnkC docker-compose -p mainnet up
clean:
	rm -rf ./data