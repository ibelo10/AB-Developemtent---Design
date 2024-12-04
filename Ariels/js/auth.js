<!-- js/auth.js -->
// Sample vendor data (replace with actual database/API calls)
const vendors = [
    {
        id: "V001",
        password: "test123",
        name: "Sweet Shop Inc.",
        orders: [
            {
                orderId: "ORD001",
                date: "2024-02-15",
                items: [
                    { name: "Original Pralines", quantity: 100 },
                    { name: "Gift Boxes", quantity: 20 }
                ],
                total: "$1,250.00",
                status: "Delivered"
            },
            {
                orderId: "ORD002",
                date: "2024-03-01",
                items: [
                    { name: "Chocolate Covered Pralines", quantity: 75 }
                ],
                total: "$975.00",
                status: "Processing"
            }
        ]
    }
];

function showLogin() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function hideLogin() {
    document.getElementById('loginModal').classList.add('hidden');
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const vendorId = document.getElementById('vendorId').value;
    const password = document.getElementById('password').value;

    const vendor = vendors.find(v => v.id === vendorId && v.password === password);

    if (vendor) {
        // Store vendor session
        sessionStorage.setItem('currentVendor', JSON.stringify(vendor));
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
});
