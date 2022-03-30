import { memo, useEffect, useState } from 'react';
import { getReviews } from 'src/utils/requests';
import ReviewTitle from '../../components/Review/ReviewTitle';
import { useParams } from 'react-router-dom';
import { ReviewList } from 'components/Review/ReviewList';
import { TopBtn } from 'components/Review/TopBtn';
import Spinner from 'components/Spinner/Spinner';
import { getMockdataReviews } from 'src/utils/reviews';

const Reviews = (): JSX.Element => {
  const { id } = useParams();
  const [hotelId, setHotelId] = useState<string>(id);

  const [target, setTarget] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reviews, setReivews] = useState<object[]>([]);
  const [mockDataReviews, setMockDataReviews] = useState<object[]>([]);

  let nextUrl = '';
  let currentPage = 1;
  let totalPage;

  const getMoreItem = async () => {
    setIsLoaded(true);
    const presentReview = await getReviews(hotelId, nextUrl);

    currentPage = presentReview.pagination.currentPage;
    totalPage = presentReview.pagination.totalPages;
    nextUrl = presentReview.pagination.nextURL;
    setReivews(currentReviews => [
      ...currentReviews,
      ...presentReview.reviews.hermes.groups[presentReview.reviews.hermes.groups.length - 1].items,
    ]);
    setIsLoaded(false);
  };

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting && !isLoaded && currentPage !== totalPage) {
      observer.unobserve(entry.target);
      await getMoreItem();
      observer.observe(entry.target);
    } else return;
  };

  useEffect(()=>{
    const getReviews = async () => {
      const reviews= await getMockdataReviews(hotelId);
      setMockDataReviews(reviews);
      console.log(reviews)
    }
    getReviews();
  }, []);

  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.5,
      });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  return (
    <>
      <ReviewTitle />
      <ReviewList reviews={mockDataReviews} />
      <ReviewList reviews={reviews} />
      <TopBtn />
      <div ref={setTarget}>{isLoaded && <Spinner />}</div>
    </>
  );
};

export default memo(Reviews);
