export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style                 : 'currency',
    currency              : 'INR',
    minimumFractionDigits : 2,
    maximumFractionDigits : 2
  }).format(amount || 0)
}
export const formatDate = (dateString) => {
  if (!dateString) return '—'

  return new Date(dateString).toLocaleDateString('en-IN', {
    day   : '2-digit',
    month : 'short',
    year  : 'numeric',
    hour  : '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
export const getStatusClass = (status) => {
  return status === 'Active'
    ? 'badge badge-active'
    : 'badge badge-inactive'
}
