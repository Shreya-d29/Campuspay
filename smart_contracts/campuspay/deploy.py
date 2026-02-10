from algokit_utils import AlgorandClient, Arc56Contract
from pathlib import Path

def deploy():
    # Use AlgorandClient for LocalNet
    algorand = AlgorandClient.default_localnet()
    
    # Get the default funded account
    deployer = algorand.account.localnet_dispenser()
    print(f"Deploying from account: {deployer.address}")

    # Path to ARC-56 JSON
    arc56_path = Path(__file__).parent / "CampusPay.arc56.json"
    
    with open(arc56_path, "r") as f:
        arc56_json = f.read()

    # Load the ARC-56 contract spec
    app_spec = Arc56Contract.from_json(arc56_json)
    
    # Get the AppFactory
    factory = algorand.client.get_app_factory(
        app_spec=app_spec,
        default_sender=deployer.address
    )
    
    # Deploy the contract
    print("Deploying CampusPay smart contract...")
    try:
        deploy_result = factory.deploy(
            on_schema_break="replace",
            on_update="update"
        )
        print(f"Successfully deployed CampusPay!")
        print(f"Deploy Result: {deploy_result}")
    except Exception as e:
        print(f"Deployment failed: {e}")

if __name__ == "__main__":
    deploy()
