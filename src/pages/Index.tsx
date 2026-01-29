import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { Features } from '@/components/home/Features';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedCourses />
      <Features />
    </Layout>
  );
};

export default Index;
