const prisma = require('../config/db');
const generateToken = require('../utils/generateToken');
const { hashPassword, comparePassword } = require('../utils/hashPassword');

function buildUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function register(req, res) {
  try {
    const { name, email, password, address } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Email already exists',
        },
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        address,
        role: 'USER',
      },
    });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Email already exists',
        },
      });
    }

    throw error;
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      },
    });
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      },
    });
  }

  const token = generateToken(user);

  return res.status(200).json({
    token,
    user: buildUserResponse(user),
  });
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'User not found',
      },
    });
  }

  const isOldPasswordValid = await comparePassword(oldPassword, user.password);

  if (!isOldPasswordValid) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Old password is incorrect',
      },
    });
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return res.status(200).json({
    message: 'Password updated',
  });
}

module.exports = {
  register,
  login,
  changePassword,
};
