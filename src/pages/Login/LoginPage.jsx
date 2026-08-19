import background from '../../assets/images/backgroud_login.png'
import { LoginCard } from '../../components/Login/LoginCard.jsx'

export const LoginPage = () => (
  <main
    className="relative grid min-h-screen place-items-center overflow-hidden bg-orange-950 p-4"
    style={{
      backgroundImage: `linear-gradient(120deg, rgba(124, 45, 18, 0.72), rgba(255, 247, 237, 0.2)), url(${background})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.35),transparent_28rem)]" />
    <div className="relative z-10 flex w-full items-center justify-center">
      <LoginCard />
    </div>
  </main>
)
