export interface DocumentFile {
  _id: string;
  nameOrg: string;
  path: string;
}

export interface Document {
  _id: string;
  name: string;
  sign?: string;
  files: DocumentFile[];
}

export interface GetDocumentListParams {
  limit?: number;
  populates?: string;
  select?: string;
  parentID?: string;
  lastestID?: string;
}

export interface DocumentListResponse {
  data: Document[];
  pagination?: {
    nextCursor?: string;
    hasMore?: boolean;
  };
}
