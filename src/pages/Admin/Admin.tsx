import { useEffect } from "react";
import { useUser } from '../../context/UserContext.tsx';
import { useNavigate } from "react-router-dom";
import { saveGrub } from "../../api/AdminApi";

interface Roba {
    id: number;
    type: string;
    price: number;
    opis: string;
    detalenOpis: string;
    lista_Sliki: string[];
    lista_Size: string[];
    sizePicked: string | null;
    popust: boolean;
    cenaSoPopust: number;
}

const Admin = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        if (user === undefined) return; // Wait for user to load

        if (!user || !user.roles?.includes('ROLE_ADMIN')) {
            navigate('/eshop');
            return;
        }

        const testRoba: Roba = {
            id: 1,
            type: "Shirt",
            price: 100,
            opis: "Test shirt",
            detalenOpis: "Detailed description",
            lista_Sliki: ["img1.jpg", "img2.jpg"],
            lista_Size: ["S", "M", "L"],
            sizePicked: null,
            popust: false,
            cenaSoPopust: 0
        };
        saveGrub(testRoba);
    }, [user, navigate]);

    if (user === undefined) {
        return <div>Loading...</div>;
    }

    if (!user || !user.roles?.includes('ROLE_ADMIN')) {
        return null;
    }

    return <div>Admin</div>;
};

export default Admin;
