const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to generate JWT
function generateToken(user, secret) {
    return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1d' });
}

// REGISTER
const register = async function(req, res) {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        console.log("EMAIL IS:", email);

        // Validate incoming data
        if (!email || !password) {
            return res.status(400).json({ error: 'Email & password required' });
        }

        const existing = await User.findOne({ email });
        console.log("EXISTING USER:", existing);

        if (existing) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

   
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        });

        console.log("User saved successfully:", user._id);

        const token = generateToken(user, process.env.JWT_SECRET);

        res.status(201).json({
            message: 'User registered successfully',
            token
        });

    } catch (err) {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
    }

};

// LOGIN
const login = async function(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        
        //NOTE that we are comparing a salted user.password to password which bcrypt seems to handle just fine
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = generateToken(user, process.env.JWT_SECRET);
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//GET ALL USERS
const getAllUsers = async function(req, res) {
    try {
        console.log('We are in All users')
        const users = await User.find(); // fetch all users
       
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }
        res.json({ message: 'Users fetched successfully', users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// GET USER BY ID for client users
const getUser = async function(req, res) {
    try {
        console.log('RRRRRRRR ', req)
        const user = await User.findById(req.user.id);
        console.log('Found user ', user)
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User fetched successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* GET USER BY ID for Admin users. we use param id to see any user's task
We can improve the security of this API by doing something like this:
1. Add a new attribute (accesslevel) in model Users
2. JWT Decoding (middleware)
    Always decode the token and attach user info to req.user (id, email, accessLevel).
3. Route Access Check (middleware or inside controller)
    Compare req.user.id to req.params.id.
    If they match, allow access.
    If they don’t, check req.user.accessLevel. Only allow if the access level permits cross-user access (e.g., "admin").
*/
const getUserAdmin = async function(req, res) {
    try {
        const user = await User.findById(req.param.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User fetched successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// CHANGE PASSWORD
const changePassword = async function(req, res) {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { oldPassword, newPassword } = req.body;
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Old password incorrect' });

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CHANGE NAME
const changeName = async function(req, res) {
    try {
        const { firstName, lastName } = req.body;
        const updated = await User.findByIdAndUpdate(req.user.id, { firstName, lastName }, { new: true });
        res.json({ message: 'Name updated successfully', user: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CHANGE EMAIL
const changeEmail = async function(req, res) {
    try {
        const { email } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already in use' });

        const updated = await User.findByIdAndUpdate(req.user.id, { email }, { new: true });
        res.json({ message: 'Email updated successfully', user: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE USER
const deleteUser = async function(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Optionally mark tasks as DELETED
        // await Task.updateMany({ userId: user._id }, { status: 'DELETED' });

        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    register,
    login,
    getAllUsers,
    getUser,
    changePassword,
    changeName,
    changeEmail,
    deleteUser
};
