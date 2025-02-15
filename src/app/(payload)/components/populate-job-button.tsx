const PopulateJobButton: React.FC = () => {
  const handleClick = async () => {
    try {
      const response = await fetch('/api/custom-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      console.log('Resultado:', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="btn btn-primary" // Ajusta las clases según tu sistema de estilos
    >
      Ejecutar Trabajo
    </button>
  )
}

export default PopulateJobButton
