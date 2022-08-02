import { IoIosStar, IoIosGitNetwork, IoIosLink } from 'react-icons/io'
import Clamp from 'react-multiline-clamp'
import Link from 'next/link'
import Image from 'next/image'

const RepoCount = ({ Icon, count }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <Icon className="text-comment" />
      <p className="text-comment text-sm">{count}</p>
    </div>
  )
}

const RepoLink = ({ Icon, url }) => {
  return (
    <Link href={url}>
      <a target="_blank">
        <Icon className="text-comment text-xl hover:text-l-primary hover:dark:text-d-primary" />
      </a>
    </Link>
  )
}

const GitCard = ({ rep }) => {
  return (
    <div
      key={rep.repo}
      className="w-full h-full rounded-xl bg-gradient-to-t from-l-bg dark:from-d-bg to-[#ebebea99] dark:to-[#24272799] top-0
                       border-solid border-2 border-l-bg dark:border-d-bg flex flex-col text-forma aspect-square overflow-hidden
                       relative hover:-top-2 transition-all duration-500 ease-in-out shadow-lg dark:shadow-[#33333381]"
    >
      <div className="relative w-full h-full">
        <Link href={rep.link}>
          <a target="_blank">
            <Image
              className="rounded-t-xl"
              src={rep.image}
              alt={rep.repo + '-Image'}
              layout="fill"
              objectFit="cover"
            />
          </a>
        </Link>
      </div>
      <div className="p-4 h-full flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="font-bold text-xl text-l-primary dark:text-d-primary">
            <Link href={rep.link}>
              <a target="_blank">{'/' + rep.repo}</a>
            </Link>
          </div>
          <div className="flex flex-row gap-2 items-center">
            {rep.website ? (
              <RepoLink Icon={IoIosLink} url={rep.website} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex-grow flex-shrink mt-4 mb-2">
          <Clamp lines={2}>{rep.description}</Clamp>
        </div>
        <div className="flex flex-row justify-between">
          <div
            className="flex items-center gap-2"
            style={{ '--languageColor': rep.languageColor }}
          >
            <p className="text-comment text-sm">{rep.language}</p>
            <div className="h-3 w-3 rounded-full bg-languageColor"></div>
          </div>
          <div className="flex flex-row gap-4">
            <RepoCount Icon={IoIosStar} count={rep.stars} />
            <RepoCount Icon={IoIosGitNetwork} count={rep.forks} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitCard
