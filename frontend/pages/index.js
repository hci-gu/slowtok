import dynamic from 'next/dynamic'

const DynamicHome = dynamic(() => import('../views/Home'), { ssr: false })

const HomePage = () => <DynamicHome />

export default HomePage
