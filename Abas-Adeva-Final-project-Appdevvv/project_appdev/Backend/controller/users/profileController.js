const profileModel = require('../../model/profileModel');

exports.getProfile = async (req, res) => {
    try {
        // Get userId from session
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authenticated' 
            });
        }

        // Get profile data
        const profile = await profileModel.getByUserId(userId);
        if (!profile) {
            return res.status(404).json({ 
                success: false, 
                message: 'Profile not found' 
            });
        }

        res.json({ 
            success: true, 
            profile: {
                fullname: profile.fullname,
                email: profile.email,
                phone: profile.phone || '',
                address: profile.address || ''
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching profile',
            error: error.message 
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // Get userId from session
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authenticated' 
            });
        }

        const { phone, address } = req.body;
        
        // Update profile
        await profileModel.updateProfile(userId, { phone, address });
        
        // Get updated profile
        const updatedProfile = await profileModel.getByUserId(userId);
        
        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            profile: {
                fullname: updatedProfile.fullname,
                email: updatedProfile.email,
                phone: updatedProfile.phone || '',
                address: updatedProfile.address || ''
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error updating profile',
            error: error.message 
        });
    }
};

// Create initial profile after registration
exports.createInitialProfile = async (userId, userData) => {
    try {
        await profileModel.createInitialProfile(userId, userData);
        return true;
    } catch (error) {
        console.error('Error creating initial profile:', error);
        return false;
    }
};
