// Types pour les présentations PowerPoint
export interface Presentation {
  id: string;
  name: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  webUrl: string;
  slides?: Slide[];
}

export interface Slide {
  id: string;
  index: number;
  title?: string;
  shapes?: Shape[];
}

export interface Shape {
  id: string;
  type: string;
  text?: string;
  position?: Position;
  size?: Size;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextContent {
  text: string;
  formatting?: TextFormatting;
}

export interface TextFormatting {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
}

export interface SlideLayout {
  type: string;
  name: string;
  elements: LayoutElement[];
}

export interface LayoutElement {
  type: 'title' | 'content' | 'image' | 'chart';
  placeholder: string;
  position: Position;
  size: Size;
}

// Types pour l'authentification Microsoft Graph
export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  redirectUri?: string;
}

export interface GraphAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

// Types pour les opérations MCP
export interface CreatePresentationArgs {
  name: string;
  templateId?: string;
}

export interface AddSlideArgs {
  presentationId: string;
  layout?: string;
  index?: number;
}

export interface UpdateSlideContentArgs {
  presentationId: string;
  slideId: string;
  content: SlideContent;
}

export interface SlideContent {
  title?: string;
  text?: string;
  images?: ImageContent[];
  charts?: ChartContent[];
}

export interface ImageContent {
  url: string;
  position: Position;
  size: Size;
  altText?: string;
}

export interface ChartContent {
  type: 'bar' | 'line' | 'pie' | 'column';
  data: ChartData;
  position: Position;
  size: Size;
  title?: string;
}

export interface ChartData {
  categories: string[];
  series: ChartSeries[];
}

export interface ChartSeries {
  name: string;
  values: number[];
}

export interface DeleteSlideArgs {
  presentationId: string;
  slideId: string;
}

export interface GetPresentationArgs {
  presentationId: string;
  includeSlides?: boolean;
}

export interface ListPresentationsArgs {
  limit?: number;
  search?: string;
}

export interface SharePresentationArgs {
  presentationId: string;
  permissions: 'read' | 'edit';
  emails: string[];
}