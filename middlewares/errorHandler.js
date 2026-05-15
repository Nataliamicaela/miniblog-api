const errorHandler = (
  error,
  req,
  res,
  next
) => {

  console.error(error);

  // PostgreSQL unique violation
  if (error.code === '23505') {

    return res.status(400).json({
      error: 'Email already exists'
    });

  }

  // PostgreSQL foreign key violation
  if (error.code === '23503') {

    return res.status(400).json({
      error: 'Related resource does not exist'
    });

  }

  res.status(500).json({
    error: 'Internal server error'
  });

};

module.exports = errorHandler;