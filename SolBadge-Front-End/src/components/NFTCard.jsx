import React from "react";
import LocationIcon from '../assets/location.svg'

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
};

const NFTCard = ({nft}) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(nft.timestamp * 1000).toLocaleDateString('en-GB', options);

    return (
        <>
            <div 
                className="
                    hidden sm:flex
                    bg-cover bg-center w-72 h-96 rounded-3xl p-2 
                    border-2 flex-col justify-between
                    hover:border-[var(--primary)] hover:cursor-pointer"
                style={{ backgroundImage: `url(${nft.image})`}}>
                <div className="w-full flex justify-end">
                    <button className="
                    p-2 w-12 h-12 flex items-center justify-center rounded-2xl 
                    bg-slate-300/40 backdrop-blur-sm hover:bg-[var(--primary)]">
                        <img src={LocationIcon} alt="Location" className="w-6"/>
                    </button>
                </div>
                <div className="
                    p-2 items-center justify-center rounded-2xl 
                    bg-slate-500/40 backdrop-blur-sm">
                    <h3 className="text-white text-xl font-bold">{nft.name}</h3>
                    <h4 className="text-white text-sm">{truncateText(nft.description, 69)}</h4>
                </div>
            </div>
            <div className="
                flex sm:hidden
                bg-[var(--secondary-background)]
                w-full h-35 p-2 rounded-3xl justify-start
            ">
                <img src={nft.image} alt="NFT" className="w-32 h-32 object-cover rounded-2xl"/>
                <div className="p-2">
                    <h3 className="text-white text-md font-semibold">{nft.name}</h3>
                    <h4 className="text-white text-xs">{truncateText(nft.description, 69)}</h4>
                    <p className="text-xs">{date}</p>
                </div>

            </div>
        </>
    )
}

export default NFTCard;