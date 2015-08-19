/////////////////////////////////////////////////////////////////////////////////////
//
//	Senior Project - Kevin VanEmmerik
//  Convert PDFs to text files (Using Apache pdfbox)
// 
/////////////////////////////////////////////////////////////////////////////////////

import org.apache.pdfbox.util.PDFTextStripper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.*;
import java.util.StringTokenizer;
import java.util.Scanner;
import java.math.*;
import java.io.*;

public class MainProgram
{
	public static void main(String[]args) throws IOException 
	{
      // Needed variables
      ///////////////////////////////////////////////////////////////////////////////
      int numFiles = 0;
      double tempInt = 0;
      String[] docNameStr = new String[200];
      String[] locationStr = new String[200];
      String tempStr = "";
      
      // Open list.txt
      ///////////////////////////////////////////////////////////////////////////////
      File listTxtFile = new File("list.txt");
      Scanner listOfPdf = new Scanner(listTxtFile);
      
      // Read PDF file names and locations from list.txt
	  // and fill arrays locationStr and docNameStr
      ///////////////////////////////////////////////////////////////////////////////
      while(listOfPdf.hasNextLine())
      {
         locationStr[numFiles] = listOfPdf.nextLine();
         StringTokenizer tokens = new StringTokenizer(locationStr[numFiles],"/");
         tempStr = tokens.nextToken();
         tempStr = tokens.nextToken();
         StringTokenizer tokens2 = new StringTokenizer(tempStr,".");
         tempStr = tokens2.nextToken();
         docNameStr[numFiles] = tempStr;
         numFiles++;
      }
      
      // Loop through each PDF
      ///////////////////////////////////////////////////////////////////////////////
      for(int i=0; i<numFiles; i++)
      {
		// Put PDF text into .txt files
		/////////////////////////////////////////////////////////////////////////////
         PDDocument pdfFile = PDDocument.load(new File(locationStr[i]));
         PDFTextStripper pdfStripped = new PDFTextStripper();
         String pdfText = pdfStripped.getText(pdfFile);
         PrintWriter txtFile = new PrintWriter("txtFolder/" + docNameStr[i] + ".txt");
         txtFile.println(pdfText);
         txtFile.close();
		 
		// A simple way to view progress
		/////////////////////////////////////////////////////////////////////////////
         tempInt = 100.0*(i/(numFiles*1.0));
         System.out.println(Math.round(tempInt) + "% complete");
      }
      System.out.println("Done");
   }
}

