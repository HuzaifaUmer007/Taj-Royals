import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// POST - Seed sample categories
export async function POST() {
  try {
    const sampleCategories = [
      {
        name: 'Men',
        slug: 'men',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Women', 
        slug: 'women',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kids',
        slug: 'kids',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const sampleSubcategories = [
      {
        name: 'Top Wear',
        slug: 'top-wear',
        categoryId: '', // Will be set after categories are created
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bottom Wear',
        slug: 'bottom-wear', 
        categoryId: '', // Will be set after categories are created
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dresses',
        slug: 'dresses',
        categoryId: '', // Will be set after categories are created
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add categories first
    const categoryIds = [];
    for (const category of sampleCategories) {
      const docRef = await addDoc(collection(db, 'categories'), category);
      categoryIds.push(docRef.id);
    }

    // Add subcategories with proper categoryId
    for (let i = 0; i < sampleSubcategories.length; i++) {
      const subcategory = {
        ...sampleSubcategories[i],
        categoryId: categoryIds[i % categoryIds.length] // Distribute across categories
      };
      await addDoc(collection(db, 'subcategories'), subcategory);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sample data seeded successfully',
      categoriesAdded: sampleCategories.length,
      subcategoriesAdded: sampleSubcategories.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ success: false, message: 'Failed to seed data' }, { status: 500 });
  }
}

