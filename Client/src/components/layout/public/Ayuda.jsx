export const Ayuda = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', padding: '20px' }}>
      <h1>Contacto - Ideas Entrelazadas</h1>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>
        Si estás interesado en un perfil exclusivo para promocionar eventos, voluntariado y talleres que 
        unen el espíritu innovador y colaborativo de Ideas Entrelazadas, ¡contáctanos! Queremos colaborar con 
        personas apasionadas que buscan hacer la diferencia.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '8px', fontSize: '16px' }}>Nombre de la empresa:</td>
            <td style={{ padding: '8px', fontSize: '16px' }}>Ideas Entrelazadas</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '8px', fontSize: '16px' }}>Teléfono:</td>
            <td style={{ padding: '8px', fontSize: '16px' }}>+34 123 456 789</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '8px', fontSize: '16px' }}>Email:</td>
            <td style={{ padding: '8px', fontSize: '16px' }}>contacto@ideasentrelazadas.es</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
