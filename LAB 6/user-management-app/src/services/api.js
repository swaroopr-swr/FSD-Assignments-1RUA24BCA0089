export const fetchApiUsers = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Map the external data to match our UserCard structure
    return data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.address.city
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
