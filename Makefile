up-local:
	NETWORK_RPC=hh:http://host.docker.internal:8545 docker-compose -p hh up
up-rinkeby:
	NETWORK_RPC=goerli:https://eth-rinkeby.alchemyapi.io/v2/2rkHcv3Pdg7j3iHPWUu9cDsEOtSoXtoB docker-compose -p rinkeby up
up-goerli:
	NETWORK_RPC=goerli:https://eth-goerli.g.alchemy.com/v2/IG5Is2xWE1WkB-h0cN1NX58xw_74WEZj docker-compose -p goerli up
