import React from 'react';
import './AntminerCard.css';

function AntminerCard({ device }) {
    return (
        <div className="antminer-card">
            <div className="antminer-header">
                <h2>{device.name}</h2>
                <p>{device.ip}</p>
                <p>{device.pool}</p>
            </div>
            <div className="antminer-body">
                <div className="antminer-fans">
                    <h3>Fans</h3>
                    <div className="fan">
                        <p>Fan 1: {device.fans[0]} RPM</p>
                        <p>Fan 2: {device.fans[1]} RPM</p>
                    </div>
                    <div className="fan">
                        <p>Fan 3: {device.fans[2]} RPM</p>
                        <p>Fan 4: {device.fans[3]} RPM</p>
                    </div>
                </div>
                <div className="antminer-boards">
                    <h3>Boards</h3>
                    <div className="board" style={{ backgroundColor: device.boards[0].color }}>
                        {device.boards[0].temp}°C
                    </div>
                    <div className="board" style={{ backgroundColor: device.boards[1].color }}>
                        {device.boards[1].temp}°C
                    </div>
                    <div className="board" style={{ backgroundColor: device.boards[2].color }}>
                        {device.boards[2].temp}°C
                    </div>
                </div>
                <div className="antminer-hashrate">
                    <h3>Hashrate</h3>
                    <p>{device.hashrate} TH/s</p>
                </div>
            </div>
        </div>
    );
}

export default AntminerCard;
