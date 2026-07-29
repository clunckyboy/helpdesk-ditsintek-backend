import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import ClientError from '../../../exceptions/client-error.js';
import FaqRepositories from '../repositories/faq-repositories.js';
import { generateFaqEmbeddings } from '../utils/embedding-helper.js';
import { createFaqPayloadSchema, searchFaqPayloadSchema, updateFaqPayloadSchema } from '../validator/schema.js';

export const createFaq = async (req, res, next) => {
  try {
    const { error, value } = createFaqPayloadSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      return next(new ClientError(error.details[0].message, 400));
    }

    const embeddings = await generateFaqEmbeddings(value.question, value.answer);
    const faq = await FaqRepositories.createFaq({ ...value, embeddings });

    if (!faq) {
      return next(new InvariantError('FAQ gagal ditambahkan'));
    }

    return response(res, 201, 'FAQ berhasil ditambahkan', faq);
  } catch (error) {
    next(error);
  }
};

export const searchFaqs = async (req, res, next) => {
  try {
    // Validate query params
    const { error, value } = searchFaqPayloadSchema.validate(req.query, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      return next(new ClientError(error.details[0].message, 400));
    }

    let { query, category, limit } = value;
    limit = limit ? parseInt(limit, 10) : 5;

    const results = await FaqRepositories.searchFaqs(query, category, limit);

    if (results.length === 0) {
      return response(res, 200, 'FAQ berhasil dikembalikan.', []);
    }

    return response(res, 200, 'FAQ berhasil ditemukan', results);
  } catch (error) {
    next(error);
  }
};

export const getFaqById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await FaqRepositories.getFaqById(id);

    if (!faq) {
      return next(new NotFoundError('FAQ tidak ditemukan'));
    }

    return response(res, 200, 'FAQ berhasil diambil', faq);
  } catch (error) {
    next(error);
  }
};

export const updateFaqById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateFaqPayloadSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      return next(new ClientError(error.details[0].message, 400));
    }

    const existingFaq = await FaqRepositories.getFaqById(id);

    if (!existingFaq) {
      return next(new NotFoundError('FAQ tidak ditemukan'));
    }

    const mergedFaq = {
      ...existingFaq,
      ...value,
    };

    const embeddings = await generateFaqEmbeddings(mergedFaq.question, mergedFaq.answer);
    const updatedFaq = await FaqRepositories.updateFaqById(id, {
      ...mergedFaq,
      embeddings,
    });

    if (!updatedFaq) {
      return next(new InvariantError('FAQ gagal diupdate'));
    }

    return response(res, 200, 'FAQ berhasil diupdate', updatedFaq);
  } catch (error) {
    next(error);
  }
};

export const getAllFaqs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const faqs = await FaqRepositories.getAllFaqs(category);

    return response(res, 200, 'FAQs berhasil diambil', faqs);
  } catch (error) {
    next(error);
  }
};

export const deleteFaqById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedFaq = await FaqRepositories.deleteFaqById(id);

    if (!deletedFaq) {
      return next(new NotFoundError('FAQ tidak ditemukan'));
    }

    return response(res, 200, 'FAQ berhasil dihapus', deletedFaq);
  } catch (error) {
    next(error);
  }
};
