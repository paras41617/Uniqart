import React from "react";
import '../css/About.css'

class About extends React.Component {
    render() {
        return (
            <div id="complete_about_div">
                <div id="about_heading">
                    About
                </div>
                <div className="blockchain_heading">
                    Uniqart
                </div>
                <div className="blockchain_content">
                    Uniqart is the best NFT Marketplace. This is the one stop solution of NFTs . On this website anyone can sell their NFT , make collection of their NFTs , Like and appreciate other's NFTS and collections , Make Live Auction to make it more interesting and also buy other people's NFTs and collections.
                </div>
                <div className="blockchain_heading">
                    Blockchain
                </div>
                <div className="blockchain_content">
                    A blockchain is a growing list of records, called blocks, that are linked together using cryptography. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data (generally represented as a Merkle tree). The timestamp proves that the transaction data existed when the block was published in order to get into its hash. As blocks each contain information about the block previous to it, they form a chain, with each additional block reinforcing the ones before it. Therefore, blockchains are resistant to modification of their data because once recorded, the data in any given block cannot be altered retroactively without altering all subsequent blocks.<br />

                    Blockchains are typically managed by a peer-to-peer network for use as a publicly distributed ledger, where nodes collectively adhere to a protocol to communicate and validate new blocks. Although blockchain records are not unalterable as forks are possible, blockchains may be considered secure by design and exemplify a distributed computing system with high Byzantine fault tolerance.
                </div>
                <div className="blockchain_heading">
                    ERC-721 Token
                </div>
                <div className="blockchain_content">
                    ERC-721 is a free, open standard that describes how to build non-fungible or unique tokens on the Ethereum blockchain. While most tokens are fungible (every token is the same as every other token), ERC-721 tokens are all unique. <br />

                    Think of them like rare, one-of-a-kind collectables.
                </div>
                <div className="blockchain_heading">
                    NFT
                </div>
                <div className="blockchain_content">
                    An NFT is a unit of data stored on a digital ledger, called a blockchain, which can be sold and traded. The NFT can be associated with a particular digital or physical asset (such as a file or a physical object) and a license to use the asset for a specified purpose. An NFT (and, if applicable, the associated license to use, copy or display the underlying asset) can be traded and sold on digital markets. The extralegal nature of NFT trading usually results in an informal exchange of ownership over the asset that has no legal basis for enforcement, often conferring little more than use as a status symbol.

                    NFTs function like cryptographic tokens, but, unlike cryptocurrencies such as Bitcoin or Ethereum, NFTs are not mutually interchangeable, hence not fungible. While all bitcoins are equal, each NFT may represent a different underlying asset and thus may have a different value. NFTs are created when blockchains string records of cryptographic hash, a set of characters identifying a set of data, onto previous records therefore creating a chain of identifiable data blocks. This cryptographic transaction process ensures the authentication of each digital file by providing a digital signature that is used to track NFT ownership. However, data links that point to details such as where the art is stored can be affected by link rot.
                </div>
                <div className="blockchain_heading">
                    NFT Marketplace
                </div>
                <div className="blockchain_content">
                    An NFT marketplace is a platform that acts as a medium or a meeting point for collectors and creators. Creators can come, list their NFTs on the marketplace. Whereas, for collectors, all they have to do is to come, bid, and buy their favorite NFT. Through this process, they come a step closer to their favorite celebrities, artists, or creators. For creators, it is a golden opportunity to get the real deal. Every time the NFT collectible is sold the creators a small percentage of profit as royalty.
                </div>
            </div>
        )
    }
}

export default About;