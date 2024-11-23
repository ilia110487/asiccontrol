import CardRenderer from './components/cards/CardRenderer';

const DeviceDashboard = ({ devices }) => {
    return (
        <div className="device-dashboard">
            {devices.map((device) => (
                <CardRenderer key={device.id} device={device} />
            ))}
        </div>
    );
};

export default DeviceDashboard;
