import './TechnologyCard.css';

function TechnologyCard({ title, description, status, onClick }) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      default: return '#F44336';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  return (
    <div 
      className="technology-card" 
      style={{ borderLeft: `5px solid ${getStatusColor()}` }}
      onClick={onClick}
    >
      <h3>{title}</h3>
      <p className="description">{description}</p>
      <div className="status-badge" style={{ backgroundColor: getStatusColor() }}>
        {getStatusText()}
      </div>
    </div>
  );
}

export default TechnologyCard;