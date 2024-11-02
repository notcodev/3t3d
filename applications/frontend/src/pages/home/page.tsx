import { Button } from '@/shared/ui'

export const HomePage = () => {
  return (
    <>
      <header className="w-contaiter mx-auto flex justify-center py-12">
        <img src="logo-main.svg" className="w-[28rem]" alt="3t3d" />
      </header>
      <div className="max-w-contaiter mx-auto flex justify-center py-4 gap-4">
        <div className="flex-1" />
        <div className="flex-[2] py-6 flex justify-center">
          <nav className="max-w-[20rem] h-fit w-full grid grid-cols-2 justify-center items-center gap-4">
            <Button className="w-full col-span-2">Play</Button>
            <Button className="w-full col-span-2">Store</Button>
            <Button className="w-full">Options</Button>
            <Button className="w-full">Skins</Button>
          </nav>
        </div>
        <aside className="flex-1">
          <div className="flex flex-col items-center gap-4">
            <div className="w-[150px] h-[250px] bg-black" />
            <Button className="w-full max-w-24">Profile</Button>
          </div>
        </aside>
      </div>

      <section className="h-screen">
        <div className="mx-auto w-contaiter h-full pt-16">
          <div>
            <aside />
            <main className=" flex flex-col items-center gap-20" />
            <aside />
          </div>
        </div>
      </section>
    </>
  )
}
