import { validateApiKey } from "@/app/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


type RevalidateRequest = {
    path?: string;
    tag?: string;
  };
  interface RevalidateResponse {
    revalidated: boolean;
    now: number;
    message?: string;
    error?: string;
  }
  export async function POST(request: NextRequest): Promise<NextResponse<RevalidateResponse>> {
    try {
      // Obtener datos del cuerpo de la solicitud
      const body: RevalidateRequest = await request.json();
      const { path, tag } = body;

      if (!validateApiKey(request)) {
        return NextResponse.json(
          {
            revalidated: false,
            now: Date.now(),
            error: 'Unauthorized access',
          },
          { status: 401 },
        )
      }
    
      // Revalidar por path o por tag
      if (path) {
        revalidatePath(path);
        return NextResponse.json({
          revalidated: true,
          now: Date.now(),
          message: `Path ${path} revalidado correctamente`
        });
      } else if (tag) {
        revalidateTag(tag);
        return NextResponse.json({
          revalidated: true,
          now: Date.now(),
          message: `Tag ${tag} revalidado correctamente`
        });
      }
      
      // Error si no se proporcionó ni path ni tag
      return NextResponse.json(
        { 
          revalidated: false, 
          now: Date.now(),
          error: 'Se requiere un parámetro "path" o "tag"' 
        },
        { status: 400 }
      );
    } catch (error) {
      // Manejar errores
      console.error('Error de revalidación:', error);
      return NextResponse.json(
        { 
          revalidated: false, 
          now: Date.now(),
          error: 'Error interno del servidor' 
        },
        { status: 500 }
      );
    }
  }