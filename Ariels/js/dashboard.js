<!-- js/dashboard.js -->
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const vendorData = sessionStorage.getItem('currentVendor');
    if (!vendorData) {
        window.location.href = 'index.html';
        return;
    }

    const vendor = JSON.parse(vendorData);
    initializeDashboard(vendor);
});

function initializeDashboard(vendor) {
    // Set vendor name
    document.getElementById('vendorName').textContent = vendor.name;

    // Set last order info
    const lastOrder = vendor.orders[0];
    document.getElementById('lastOrderInfo').textContent = 
        `${lastOrder.date} - ${lastOrder.total}`;

    // Set total orders
    document.getElementById('totalOrders').textContent = 
        `${vendor.orders.length} orders placed`;

    // Populate previous orders dropdown
    const previousOrders = document.getElementById('previousOrders');
    previousOrders.innerHTML = `
        <option value="">Select previous order</option>
        ${vendor.orders.map(order => `
            <option value="${order.orderId}">
                ${order.date} - ${order.total}
            </option>
        `).join('')}
    `;

    // Populate order history
    const orderHistory = document.getElementById('orderHistory');
    orderHistory.innerHTML = vendor.orders.map(order => `
        <tr class="hover:bg-amber-50">
            <td class="px-6 py-4 whitespace-nowrap">
                ${order.orderId}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${order.date}
            </td>
            <td class="px-6 py-4">
                ${order.items.map(item => 
                    `${item.name} (${item.quantity})`
                ).join(', ')}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${order.total}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'}">
                    ${order.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="reorderSpecific('${order.orderId}')" 
                    class="text-amber-600 hover:text-amber-900">
                    Reorder
                </button>
            </td>
        </tr>
    `).join('');
}

function reorder() {
    const orderId = document.getElementById('previousOrders').value;
    if (orderId) {
        reorderSpecific(orderId);
    } else {
        alert('Please select an order to reorder');
    }
}

function reorderSpecific(orderId) {
    // This will be replaced with actual Square integration
    alert(`Reordering ${orderId}. Square integration pending.`);
}

function logout() {
    sessionStorage.removeItem('currentVendor');
    window.location.href = 'index.html';
}
