import { Card, CardContent } from "@/components/ui/card";
import ImageGallery, { ImageItem } from "./image-gallery";

// Tipo para el RichText de Payload
export interface RichTextNode {
    type: string;
    children: {
      type: string;
      version: number;
      [key: string]: unknown;
    }[];
    direction: "ltr" | "rtl" | null;
    format: "" | "center" | "end" | "left" | "start" | "right" | "justify";
    indent: number;
    version: number;
  }
  
 export interface RichTextContent {
    root: RichTextNode;
    [key: string]: unknown;
  }

  export interface RichContentSection {
    description?: RichTextContent | null;
    images?: ImageItem[] | null;
  }

 export interface RichContentSectionProps {
    content: RichContentSection | null;
    title: string;
  }
  
  export const RichContentSection: React.FC<RichContentSectionProps> = ({ content, title }) => {
    if (!content) return null;
  
    const hasContent = content.description || (content.images && content.images.length > 0);
    if (!hasContent) return null;
  
    return (

          <div className="space-y-6">
            {content.images && content.images.length > 0 && (
              <ImageGallery
                images={content.images.filter((item): item is Required<ImageItem> => 
                  item.image !== null
                )} 
              />
            )}
          </div>
    );
  };
  
  // Función auxiliar para serializar el RichText
  const serializeRichText = (content: RichTextContent): string => {
    // Aquí deberías implementar la lógica para convertir el contenido
    // del RichText a HTML. Puedes usar la función que proporciona Payload
    // o implementar tu propia lógica de serialización
    return ''; // Implementa la serialización adecuada
  };