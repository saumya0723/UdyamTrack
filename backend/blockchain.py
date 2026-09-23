import hashlib
import json
import datetime
from typing import List, Dict, Any

class BlockchainLedger:
    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        self._create_genesis_block()

    def _create_genesis_block(self):
        genesis_data = {
            "index": 0,
            "timestamp": "2025-01-01T00:00:00Z",
            "entity": "MSDE / NSDC SkillTrack Root Authority",
            "proof_type": "GENESIS_NODE",
            "verification_status": "AUTHENTICATED",
            "previous_hash": "0" * 64,
            "tx_hash": self._calculate_hash(0, "2025-01-01T00:00:00Z", "GENESIS_NODE", "0" * 64)
        }
        self.chain.append(genesis_data)

    def _calculate_hash(self, index: int, timestamp: str, data: str, previous_hash: str) -> str:
        header = f"{index}|{timestamp}|{data}|{previous_hash}"
        return hashlib.sha256(header.encode()).hexdigest()

    def record_employer_verification(self, employer_name: str, gst: str, proof_file: str, verified_by: str) -> str:
        prev_block = self.chain[-1]
        new_index = len(self.chain)
        now_ts = datetime.datetime.utcnow().isoformat() + "Z"
        data_str = f"Employer:{employer_name}|GST:{gst}|Proof:{proof_file}|VerifiedBy:{verified_by}"
        tx_hash = self._calculate_hash(new_index, now_ts, data_str, prev_block["tx_hash"])

        block = {
            "index": new_index,
            "timestamp": now_ts,
            "entity": employer_name,
            "proof_type": "EMPLOYER_OFFER_VERIFICATION",
            "gst_number": gst,
            "proof_file": proof_file,
            "verified_by": verified_by,
            "previous_hash": prev_block["tx_hash"],
            "tx_hash": tx_hash
        }
        self.chain.append(block)
        return tx_hash

    def get_chain(self) -> List[Dict[str, Any]]:
        return self.chain

    def verify_integrity(self) -> bool:
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]
            if curr["previous_hash"] != prev["tx_hash"]:
                return False
        return True

# Global singleton ledger instance
blockchain_service = BlockchainLedger()
