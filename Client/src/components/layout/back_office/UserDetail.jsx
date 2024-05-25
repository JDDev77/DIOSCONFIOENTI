import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Global } from '../../../helpers/Global';

export const UserDetail = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${Global.url}user/profile/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': localStorage.getItem("token")
                      }
                    }
                )
                const data = await response.json();
                if (response.ok) {
                    setUser(data.user);
                } else {
                    setError(data.message || 'Failed to fetch user details.');
                }
            } catch (error) {
                setError('Network error or server is unreachable.');
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <header className="content__header">
                <h1>User Details</h1>
            </header>
            <div className="user-detail">
                <h2>{user.name} {user.surname}</h2>
                <p>Nickname: {user.nick}</p>
                <p>Email: {user.email}</p>
                <p>Bio: {user.bio}</p>
                <p>Role: {user.role}</p>
                <div>
                    <button onClick={() => navigate(`/admin/usuarios/actualizar/${user._id}`)}>Editar</button>
                    <button onClick={() => navigate(-1)}>Back to List</button>
                </div>
            </div>
        </>
    );
};
