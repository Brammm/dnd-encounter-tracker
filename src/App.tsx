import useApp from './hooks/useApp.tsx';
import Main from './components/page/Main.tsx';
import Nav from './components/page/Nav.tsx';

export default function App() {
    const {activeEncounterId, encounters} = useApp();
    const activeEncounter = encounters[activeEncounterId];

    return (
        <div className="w-screen h-screen flex items-stretch">
            <div className="w-64">
                <Nav />
            </div>
            <div className="w-full">
                <Main encounter={activeEncounter} />
            </div>
        </div>
    );
}
