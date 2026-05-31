const ownerNumber = '971545850864@s.whatsapp.net'; // Your number

const isOwner = (sender) => sender === ownerNumber;

const isAdmin = (sender, participants) => {
    // Logic to check if the sender is in the admin list of the group
    return participants.some(p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin'));
};

module.exports = { isOwner, isAdmin };

