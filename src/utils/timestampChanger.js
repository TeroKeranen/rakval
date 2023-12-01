export const timeStampChanger = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString('fi-FI', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeString = date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  return `${dateString} ${timeString}`;
}