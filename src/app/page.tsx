'use client';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faAward, faFile } from "@fortawesome/free-solid-svg-icons";
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartAnnotation from 'chartjs-plugin-annotation';
import Annotation from "chartjs-plugin-annotation";
import { useState } from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (percentile: number, rank: number, correctAns: number) => void;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartAnnotation,
  Annotation
);

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);


const Modal = ({ isOpen, onClose, onSubmit }: ModalProps) => {
  const [percentile, setPercentile] = useState(0);
  const [rank, setRank] = useState(0);
  const [correctAns, setCorrectAns] = useState(0);

  const handleSubmit = () => {
    onSubmit(percentile, rank, correctAns);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-80">
          <h2 className="text-xl font-bold mb-4">Update Information</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="percentile" className="block text-sm font-semibold mb-1">
                Percentile
              </label>
              <input
                type="number"
                id="percentile"
                value={percentile}
                onChange={(e) => setPercentile(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="rank" className="block text-sm font-semibold mb-1">
                Rank
              </label>
              <input
                type="number"
                id="rank"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="correctAns" className="block text-sm font-semibold mb-1">
                Correct Answers
              </label>
              <input
                type="number"
                id="correctAns"
                value={correctAns}
                onChange={(e) => setCorrectAns(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

const PieChartWithRank = ({ correctAns }: { correctAns: number }) => {
  const perc = 100 * (correctAns / 15);
  const wrong = 100 - perc;

  const data = {
    labels: ['Correct Answers', 'Wrong'],
    datasets: [
      {
        data: [perc, wrong],
        backgroundColor: ['#4A90E2', '#E0E0E0'],
        hoverBackgroundColor: ['#357ABD', '#C0C0C0'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="w-[160px] items-center relative m-auto">
      <Pie data={data} options={options} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
        🎯
      </div>
    </div>
  );
};

const LineChartWithTooltip = ({ percentile }: { percentile: number }) => {
  const data = {
    labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    datasets: [
      {
        label: 'numberOfStudents',
        data: [1, 2, 5, 8, 15, 25, 20, 10, 5, 4, 1],
        borderColor: 'rgb(147,112,219',
        borderWidth: 1,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'rgba(138, 43, 226, 1)',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 8,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `numberOfStudents: ${context.raw}`;
          },
        },
      },
      title: {
        display: false,
        text: 'Your Percentile',
        font: {
          size: 12,
        },
      },
      legend: {
        display: false
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: percentile / 10,
            xMax: percentile / 10,
            borderColor: 'rgb(147,112,219)',
            borderWidth: 1,
            label: {
              content: 'Your Percentile',
              enabled: true,
              display: true,
              position: 'top',
              font: {
                size: 12,
                weight: 'light',
              }
            }
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Percentile',
        },
      },
      y: {
        display: false,
        title: {
          display: false,
          text: 'Number of Students',
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options as any} />;
};

function Header() {
  return (
    <header className="flex justify-between items-center border-b py-4 border-gray-400 border-opacity-30">
      <div>
        <Image
          src="/logo.png"
          alt="Whatbytes logo"
          width={300}
          height={300}
          className="ml-4"
        />
      </div>
      <div className="flex items-center mr-12 border border-gray-300 border-opacity-50 rounded-lg p-2">
        <img
          src="https://avatars.githubusercontent.com/u/86619146?v=4"
          alt="User Avatar"
          className="rounded-full w-8 mr-3"
        />
        <span>Abdessamad Ait Elmouden</span>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="w-80 h-full bg-white font-medium">
      <div className="flex flex-col space-y-4 mt-20">
        <div className="h-14 flex items-center space-x-4  pl-8">
          <FontAwesomeIcon icon={faChartSimple} className="w-4" />
          <span className="text-gray-800">Dashboard</span>
        </div>
        <div className="h-14 flex items-center space-x-4 bg-gray-100 rounded-r-3xl p-2 pl-8">
          <FontAwesomeIcon icon={faAward} className="w-4 text-blue-500" />
          <span className="text-blue-600">Skill Test</span>
        </div>
        <div className="h-14 flex items-center space-x-4 pl-8">
          <FontAwesomeIcon icon={faFile} className="w-4" />
          <span className="text-gray-800">Internship</span>
        </div>
      </div>
    </aside>
  );
}

const SkillTestCard = ({ setPercentile, setRank, setCorrectAns, rank, percentile, correctAns }: { setPercentile: React.Dispatch<React.SetStateAction<number>>, setRank: React.Dispatch<React.SetStateAction<number>>, setCorrectAns: React.Dispatch<React.SetStateAction<number>>, rank: number, percentile: number, correctAns: number }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = (newPercentile: number, newRank: number, newCorrectAns: number) => {
    setPercentile(newPercentile);
    setRank(newRank);
    setCorrectAns(newCorrectAns);
  };
  return (
    <div className="bg-white">
      <div className="flex py-8 justify-between items-center mb-12 border border-gray-400 border-opacity-30 rounded-md p-4">
        <div className="flex items-center">
          <Image
            src="/html-5.png"
            alt="HTML Logo"
            width={48}
            height={48}
            className="rounded-full mr-4"
          />
          <div>
            <h4 className="font-bold mb-2">Hyper Text Markup Language</h4>
            <p>Questions: 08 | Duration: 15 mins | Submitted on 5 June 2021</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </div>
      <div className="pb-8 mb-12 border border-gray-400 border-opacity-30 rounded-md p-4">
        <p className="font-bold mb-4">Quick Statistics</p>
        <div className="flex justify-between w-full">
          <div className="flex items-center m-auto border-r-2 border-gray-500 pr-8 border-opacity-35">
            <Image
              src="/cup-svgrepo-com.svg"
              alt="CSS Logo"
              width={46}
              height={46}
              className="rounded-full mr-4"
            />
            <div className="flex flex-col m-auto">
              <h4 className="font-bold">{rank}</h4>
              <p className="font-light text-gray-600 text-sm">YOUR RANK</p>
            </div>
          </div>
          <div className="flex items-center m-auto border-r-2 border-gray-500 pr-8 border-opacity-35">
            <div className="bg-gray-200 rounded-full p-2 mr-4">
              <Image
                src="/note-text-svgrepo-com.svg"
                alt="CSS Logo"
                width={30}
                height={30}
              />
            </div>
            <div className="flex flex-col m-auto">
              <h4 className="font-bold">{percentile}%</h4>
              <p className="font-light text-gray-600 text-sm">PERCENTILE</p>
            </div>
          </div>
          <div className="flex items-center m-auto">
            <div className="bg-gray-200 rounded-full p-3   mr-4">
              <Image
                src="/check-square-svgrepo-com.svg"
                alt="CSS Logo"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col m-auto space-y-1">
              <h4 className="font-bold">{correctAns}/15</h4>
              <p className="font-light text-gray-600 text-sm">CORRECT ANSWERS</p>
            </div>
          </div>
        </div>
      </div>
      <ComparisonGraphCard percentile={percentile} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
      />
    </div>
  );
}

function ComparisonGraphCard({ percentile }: { percentile: number }) {
  return (
    <div className="pb-8 mb-12 border border-gray-400 border-opacity-30 rounded-md p-4">
      <h2 className="text-xl font-bold mb-4">Comparison Graph</h2>
      <p className="mb-4">
        You scored {percentile}% percentile which is lower than the average percentile 72% of all
        the engineers who took this assessment
      </p>
      <LineChartWithTooltip percentile={percentile} />
    </div>
  );
}

function SyllabusAnalysisCard() {
  const colors: Record<"blue-600" | "orange-600" | "red-600" | "green-600", string> = {
    "blue-600": "bg-blue-600",
    "orange-600": "bg-orange-600",
    "red-600": "bg-red-600",
    "green-600": "bg-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex-col">
      <h2 className="text-xl font-bold mb-8">Syllabus Wise Analysis</h2>
      {[
        { topic: "HTML Tools, Forms, History", percentage: "80%", color: "blue-600" },
        { topic: "Tags & References in HTML", percentage: "60%", color: "orange-600" },
        { topic: "Tables & References in HTML", percentage: "24%", color: "red-600" },
        { topic: "Tables & CSS Basics", percentage: "96%", color: "green-600" },
      ].map((item, index) => (
        <div key={index} className="mb-12 flex-col space-y-4">
          <p className="flex justify-between">
            <span>{item.topic}</span>
            <span>{item.percentage}</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`${colors[item.color as keyof typeof colors]} h-2.5 rounded-full`}
              style={{ width: item.percentage }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}


function QuestionAnalysisCard({ correctAns }: { correctAns: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Question Analysis</h2>
      <p className="mb-6 text-sm font-semibold text-gray-700">
        You scored {correctAns} questions correct out of 15. However, it still needs some
        improvements.
      </p>
      <PieChartWithRank correctAns={correctAns} />
    </div>
  );
}

export default function Home() {
  const [percentile, setPercentile] = useState(0);
  const [rank, setRank] = useState(0);
  const [correctAns, setCorrectAns] = useState(0);

  return (
    <div className="flex-1">
      <Header />
      <div className="flex space-x-2">
        <Sidebar />
        <main className="p-8 flex-col space-y-4 border-l border-gray-400 border-opacity-30">
          <h4 className="">Skill Test</h4>
          <section className="flex flex-col md:flex-row space-x-4">
            <div className="">
              <SkillTestCard
                setPercentile={setPercentile}
                setRank={setRank}
                setCorrectAns={setCorrectAns}
                rank={rank}
                percentile={percentile}
                correctAns={correctAns}
              />
            </div>
            <div className="">
              <SyllabusAnalysisCard />
              <QuestionAnalysisCard correctAns={correctAns} />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
