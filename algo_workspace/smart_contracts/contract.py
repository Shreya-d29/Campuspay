from puyapy import ARC4Contract, UInt64, arc4, gtxn, op


class CampusPay(ARC4Contract):
    def __init__(self) -> None:
        self.total_transactions = UInt64(0)
        self.total_volume = UInt64(0)

    @arc4.abimethod()
    def greet(self) -> arc4.String:
        return arc4.String("Welcome to CampusPay - The Social Finance Platform for Students!")

    @arc4.abimethod()
    def register_transaction(self, amount: UInt64) -> UInt64:
        self.total_transactions += 1
        self.total_volume += amount
        return self.total_transactions

    @arc4.abimethod()
    def get_stats(self) -> tuple[UInt64, UInt64]:
        return (self.total_transactions, self.total_volume)

    @arc4.abimethod()
    def pay_and_log(self, payment: gtxn.PaymentTransaction) -> arc4.String:
        # Verify payment is to the contract (optional, depending on use case)
        # For P2P, we might just use the contract to log the event
        assert payment.amount > 0, "Amount must be greater than 0"
        
        self.total_transactions += 1
        self.total_volume += payment.amount
        
        return arc4.String(f"Transaction of {payment.amount} ALGO logged successfully.")
