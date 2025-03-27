import { Link } from "react-router-dom";
import { useBookListStore } from "../stores/useBookListStore";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import BookListItem from "../components/BookListItem";
import BookingSummary from "../components/BookingSummary";


const BookListPage = () => {
	const { bookList } = useBookListStore();

	return (
		<div className='py-8 md:py-16'>
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
				<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{bookList.length === 0 ? (
							<EmptyBookListUI />
						) : (
							<div className='space-y-6'>
								{bookList.map((item) => (
									<BookListItem key={item._id} item={item} />
								))}
							</div>
						)}
					
					</motion.div>

					{bookList.length > 0 && (
						<motion.div
							className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<BookingSummary />
							
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};
export default BookListPage;

const EmptyBookListUI = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-4 py-16'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<ClipboardList className='h-24 w-24 text-gray-300' />
		<h3 className='text-2xl font-semibold '>Your Booking List is empty</h3>
		<p className='text-gray-400'>Looks like you {"haven't"} added anything to your booking list.</p>
		<Link
			className='mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600'
			to='/'
		>
			Start Booking
		</Link>
	</motion.div>
);
