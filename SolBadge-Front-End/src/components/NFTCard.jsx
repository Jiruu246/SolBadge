import React from "react";
import LocationIcon from '../assets/location.svg'

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
};

const NFTCard = ({nft}) => {
  return (
    <div 
        className="
            bg-cover bg-center w-72 h-96 rounded-3xl p-2 
            border-2 flex flex-col justify-between
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
  )
}

export default NFTCard;